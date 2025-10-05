export default function PlansPage() {
    return (
        <div className="container py-8">
            <h1 className="text-2xl font-bold mb-4">Plans</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Here are the available plans:
            </p>
            <ul className="mt-4 space-y-4">
                <li className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold">Free Plan</h2>
                    <p className="text-gray-600 dark:text-gray-400">Basic features for personal use.</p>
                    <span className="text-lg font-bold">$0/month</span>
                </li>
                <li className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold">Pro Plan</h2>
                    <p className="text-gray-600 dark:text-gray-400">Advanced features for professionals.</p>
                    <span className="text-lg font-bold">$9.99/month</span>
                </li>
                <li className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="text-xl font-semibold">Enterprise Plan</h2>
                    <p className="text-gray-600 dark:text-gray-400">All features for businesses.</p>
                    <span className="text-lg font-bold">$29.99/month</span>
                </li>
            </ul>
        </div>
    );
}
