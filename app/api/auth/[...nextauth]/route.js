import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";

async function getOrCreateGoogleUser({ name, email, providerAccountId }) {
  await connectToDatabase();

  let mongoUser = await User.findOne({ email });

  if (!mongoUser) {
    try {
      mongoUser = await User.create({
        name: name || "DIU Student",
        email,
        // Google does not provide a DIU student ID or password. These required
        // credential fields are deliberately non-login values for OAuth users.
        studentId: `google-${providerAccountId}`,
        password: await bcrypt.hash(randomUUID(), 12),
      });
    } catch (error) {
      // A concurrent Google sign-in can create the same email first.
      if (error?.code !== 11000) throw error;
      mongoUser = await User.findOne({ email });
      if (!mongoUser) throw error;
    }
  }

  return mongoUser;
}

export const authOptions = {
  providers: [
    // Credentials Provider (Login via DIU Student ID)
    CredentialsProvider({
      name: "DIU Student Login",
      credentials: {
        studentId: { label: "DIU Student ID", type: "text", placeholder: "221-35-XXXX" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { studentId, password } = credentials;

        if (!studentId || !password) {
          throw new Error("Please enter both Student ID and Password.");
        }

        await connectToDatabase();

        // Find user by Student ID
        const user = await User.findOne({ studentId });
        if (!user) {
          throw new Error("No account found with this DIU Student ID.");
        }

        // Verify Password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          department: user.department,
        };
      },
    }),

    // Google Provider (Checks for @diu.edu.bd email)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Ensure Google Sign-In only allows @diu.edu.bd emails
        if (!user.email?.toLowerCase().endsWith("@diu.edu.bd")) {
          return false; // Blocks sign-in if not a DIU email
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const mongoUser = await getOrCreateGoogleUser({
            name: user.name,
            email: user.email,
            providerAccountId: account.providerAccountId,
          });

          token.id = mongoUser._id.toString();
          token.studentId = mongoUser.studentId;
          token.department = mongoUser.department;
        } else {
          // CredentialsProvider already returns the MongoDB ObjectId.
          token.id = user.id;
          token.studentId = user.studentId;
          token.department = user.department;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
        session.user.studentId = token.studentId;
        session.user.department = token.department;

        // Fetch live balances from MongoDB to ensure real-time accuracy across page navigations
        await connectToDatabase();
        const freshUser = await User.findById(token.id).select(
          "oneCardBalance escrowInHold"
        );

        if (freshUser) {
          session.user.oneCardBalance = freshUser.oneCardBalance ?? 0;
          session.user.escrowInHold = freshUser.escrowInHold ?? 0;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };