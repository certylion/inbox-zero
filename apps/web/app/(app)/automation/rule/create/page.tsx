import { UpdateRuleForm } from "@/app/(app)/automation/UpdateRuleForm";
import { examples } from "@/app/(app)/automation/create/examples";

export default function CreateRulePage({
  searchParams,
}: {
  searchParams: { example: string };
}) {
  const rule =
    searchParams.example && examples[parseInt(searchParams.example)].rule;

  return (
    <div className="content-container mx-auto w-full max-w-3xl">
      <UpdateRuleForm
        rule={
          rule || {
            name: "",
            actions: [],
            type: "AI",
          }
        }
      />
    </div>
  );
}
