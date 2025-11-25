export function PlansPricesSection() {
  return (
    <div id="planes" className="py-10">
      <p className={"text-3xl text-center font-black mb-10"}>Planes de LAWI</p>
      <script async src="https://js.stripe.com/v3/pricing-table.js" />
      {/* @ts-expect-error - Stripe pricing table */}
      <stripe-pricing-table
        pricing-table-id="prctbl_1RzMIl5aFd4VysYjIqMKN0k0"
        publishable-key="pk_test_51RwSs15aFd4VysYjJLIUjQ4eG6uFeBnkzTU3xIp5acEY7MIIl5kW9mTQzjBi4xW06Tp0GcwfHY8zIP2rUoOmDArT00AdJ0wyqu"
        client-reference-id="lawyer_1234"
        customer-email="allan.mail@mail.com"
      />
    </div>
  );
}
