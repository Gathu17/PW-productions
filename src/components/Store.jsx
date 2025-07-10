import PrintfulProducts from "./PrintfulProducts";

function Store({ initialClient = "fire-conversation" }) {
  return (
    <section className="py-20">
      <div className="mx-auto px-6">
        <h2 className="text-white text-4xl font-bold mb-8 text-center section-title animate-slide-up">
          Our Store
        </h2>
        <PrintfulProducts initialClient={initialClient} />
      </div>
    </section>
  );
}

export default Store;
