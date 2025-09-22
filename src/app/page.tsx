"use client";
import dynamic from "next/dynamic";

const DynamicMapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  return <div>hello</div>;
}
