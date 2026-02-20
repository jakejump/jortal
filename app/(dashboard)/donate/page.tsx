export default function DonatePage() {
  const stripeUrl =
    "https://donate.stripe.com/6oU6oA0b88SS1vRgnSdfG00";

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Donate</h1>
      <p className="mt-2 text-foreground-secondary">
        Support the society and help preserve our traditions.
      </p>

      <div className="mt-12 max-w-xl">
        <p className="text-foreground">
          Your generous contributions help us maintain our community, host
          events, and uphold the values we hold dear. Every donation makes a
          difference.
        </p>
        <a
          href={stripeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-lg bg-accent px-8 py-4 text-lg font-medium text-background transition-colors hover:bg-accent/90"
        >
          Donate via Stripe
        </a>
      </div>
    </div>
  );
}
