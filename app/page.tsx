import BasicForm from "@/components/forms/BasicForm";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <BasicForm />
        </div>
      </section>
    </div>
  );
}
