type Await<T> =
	T extends Promise<infer U> ? U :
	T extends PromiseLike<infer U> ? U : T;

type AwaitAll<T> = {
	[P in keyof T]: Await<T[P]>;
};

export async function awaitAll<T>(obj: T): Promise<AwaitAll<T>> {
	const target = {} as {
		[P in keyof T]: Await<T[P]>;
	};
	const keys = Object.keys(obj) as (keyof typeof obj)[];
	const values = Object.values(obj);

	const resolvedValues = await Promise.all(values.map(value =>
		(!value || !value.constructor || value.constructor.name !== 'Object')
			? value
			: awaitAll(value)
	));

	for (let i = 0; i < keys.length; i++) {
		target[keys[i]] = resolvedValues[i];
	}

	return target;
}
