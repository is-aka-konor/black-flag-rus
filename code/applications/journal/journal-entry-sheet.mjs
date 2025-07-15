/**
 * Variant of the standard journal sheet to handle custom TOC numbering.
 */
export default class BlackFlagJournalEntrySheet extends foundry.applications.sheets.journal.JournalEntrySheet {
	/** @override */
	static DEFAULT_OPTIONS = {
		classes: ["black-flag"]
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_createContextMenu(handler, selector, options = {}) {
		options.fixed = true;
		return super._createContextMenu(handler, selector, options);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_preparePageData() {
		const pages = super._preparePageData();
		this.constructor._adjustTOCNumbering(this.document, pages);
		return pages;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Add Black Flag class to individual journal pages.
	 * @param {JournalEntryPageSheet} page - The page application.
	 * @param {HTMLElement} element - The page application's rendered element.
	 */
	static onRenderJournalPageSheet(page, element) {
		if (page.document.parent?.sheet instanceof BlackFlagJournalEntrySheet) {
			element.classList.add("black-flag");
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*               Helpers               */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Adjust ToC numbering for custom page types.
	 * @param {JournalEntry} entry - The parent JournalEntry.
	 * @param {Record<string, JournalSheetPageContext>} pages - The page descriptors.
	 * @internal
	 */
	static _adjustTOCNumbering(entry, pages) {
		let adjustment = 0;
		for (const descriptor of Object.values(pages)) {
			const page = entry.pages.get(descriptor.id);
			const numbering = page?.system.adjustTOCNumbering?.(descriptor.number);
			if (numbering) {
				descriptor.number = numbering.number;
				adjustment += numbering.adjustment ?? 0;
			} else {
				descriptor.number += adjustment;
			}
		}
	}
}
