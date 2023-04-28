import { Button } from "@/components/Button";
import { BoltIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div>
      <h1 className="font-title">HomePage</h1>
      <Button label="OK" primary />
      <BoltIcon className="h-6 w-6 text-blue-500" />
    </div>
  );
}
