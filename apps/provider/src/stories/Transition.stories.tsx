import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import Transition from "@/shared/ui/components/Base/Transition";

const meta = {
  title: "Components/Transition",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function TransitionExample() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="grid max-w-lg gap-5">
      <Button className="w-fit" onClick={() => setVisible((value) => !value)}>
        Toggle content
      </Button>
      <Transition
        in={visible}
        timeout={200}
        mountOnEnter
        unmountOnExit
        onEnter={(node) => {
          node.style.opacity = "0";
          node.style.transform = "translateY(8px)";
        }}
        onEntering={(node) => {
          node.style.opacity = "1";
          node.style.transform = "translateY(0)";
        }}
        onExit={(node) => {
          node.style.opacity = "0";
          node.style.transform = "translateY(8px)";
        }}
      >
        <div className="box p-6 transition-all duration-200">
          Transition lifecycle callbacks animate this surface.
        </div>
      </Transition>
    </div>
  );
}

export const Lifecycle: Story = {
  render: () => <TransitionExample />,
};
