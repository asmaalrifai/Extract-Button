import BasicForm from "@/components/forms/BasicForm";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="container max-w-[800px]">
          <BasicForm />
        </div>
      </section>
    </div>
  );
}
