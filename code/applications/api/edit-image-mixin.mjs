/**
 * Mixin method for document sheets with modified edit image method.
 * @param {typeof T} Base - Application class to extend.
 * @returns {EditImageApplication}
 * @mixin
 */
export default function EditImageMixin(Base) {
	class EditImageApplication extends Base {
		/** @override */
		static DEFAULT_OPTIONS = {
			actions: {
				editImage: EditImageApplication.#onEditImage
			}
		};

		/* <><><><> <><><><> <><><><> <><><><> */
		/*            Event Handlers           */
		/* <><><><> <><><><> <><><><> <><><><> */

		/**
		 * Edit a Document image.
		 * @this {EditImageApplication}
		 * @type {ApplicationClickAction}
		 */
		static async #onEditImage(_event, target) {
			if (target.nodeName !== "IMG") {
				throw new Error("The editImage action is available only for IMG elements.");
			}
			const attr = target.dataset.edit;
			const current = foundry.utils.getProperty(this.document._source, attr);
			const defaultArtwork = this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
			const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
			const fp = new foundry.applications.apps.FilePicker.implementation({
				current,
				document: this.document,
				type: "image",
				redirectToRoot: defaultImage ? [defaultImage] : [],
				callback: path => {
					target.src = path;
					if (this.options.form.submitOnChange) {
						const submit = new Event("submit", { cancelable: true });
						this.form.dispatchEvent(submit);
					}
				},
				position: {
					top: this.position.top + 40,
					left: this.position.left + 10
				}
			});
			await fp.browse();
		}
	}
	return EditImageApplication;
}
