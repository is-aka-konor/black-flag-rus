/**
 * Version of Map that includes a default value that will be used whenever retrieving a value if its key doesn't exist.
 */
export default class DefaultMap extends Map {
	constructor(makeDefault, iterable) {
		super(iterable);
		if (foundry.utils.getType(makeDefault) === "function") {
			this.#makeDefault = makeDefault;
		} else {
			this.#makeDefault = () => foundry.utils.deepClone(makeDefault);
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Function used to create the default value for this map.
	 * @type {Function<DefaultMap: Any>}
	 */
	#makeDefault;

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	get(key) {
		if (!this.has(key)) this.set(key, this.#makeDefault(this));
		return super.get(key);
	}
}
