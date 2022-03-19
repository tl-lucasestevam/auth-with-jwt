import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import { useAuth } from "../hooks";

const Home: NextPage = () => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Home;
