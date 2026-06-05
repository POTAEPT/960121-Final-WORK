import { useEffect, useState } from 'react';

const ClassCatalog = () => {
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadClasses = async () => {
            try {
                const response = await fetch('/api/classes');
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const payload = await response.json();
                const data = Array.isArray(payload.data) ? payload.data : [];

                if (isMounted) {
                    setClasses(data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Failed to load classes');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadClasses();

        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return <div>Loading classes...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section>
            <h1>Class Catalog</h1>
            <div>
                {classes.map((item) => (
                    <article key={item.id}>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <p>Price: {item.price}</p>
                        <p>
                            Seats: {item.current_bookings} / {item.max_capacity}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default ClassCatalog;
