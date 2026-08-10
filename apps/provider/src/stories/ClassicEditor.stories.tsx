import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import { ClassicEditor } from "@/shared/ui/components/Base/Ckeditor";

const meta = {
  title: "Components/Vendor inputs/ClassicEditor",
  parameters: {
    docs: {
      description: {
        component:
          "The production CKEditor build is mounted on demand to keep documentation navigation responsive.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function EditorExample() {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState("<p>Describe the service offered to customers.</p>");
  return (
    <div className="box grid max-w-3xl gap-4 p-6">
      <Button className="w-fit" onClick={() => setMounted((current) => !current)}>
        {mounted ? "Unmount editor" : "Mount editor"}
      </Button>
      {mounted ? (
        <div aria-label="Service description editor">
          <ClassicEditor value={value} onChange={setValue} />
        </div>
      ) : (
        <p className="text-sm text-m3-on-surface-variant">
          Mount the editor to exercise its real initialization and cleanup path.
        </p>
      )}
    </div>
  );
}

export const MountOnDemand: Story = {
  render: () => <EditorExample />,
};
