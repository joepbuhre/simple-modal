import "./style.css";

interface Options {
    prefix: true | string[] | string;
    opentargets: string[] | string;
}

declare global {
    interface Document {
        iuActiveModal: HTMLElement | null;
        iuSimpleModalInitialized: true | null;
    }
    interface Window {
        setupSimpleModal: typeof setupSimpleModal;
    }
}

// Check all action buttons for Data Modal
const setupSimpleModal = (inputOptions?: Options) => {
    // Exit early if we're already initialized
    if (document.iuSimpleModalInitialized === true) return;

    const baseOptions: Options = {
        prefix: ["iu"],
        opentargets: ["[data-iu-modal]"],
    };

    const options: Options = {
        ...baseOptions,
        ...inputOptions,
    };

    document.iuSimpleModalInitialized = true;
    document.iuSimpleModalInitialized = true;

    const getPrefix = (
        target: string,
        prefix: Options["prefix"] | string = options.prefix
    ) => {
        if (options.prefix !== prefix && prefix !== "") {
            return `data-${prefix}-${target}`;
        } else {
            return `data-${target}`;
        }
    };

    const getAttribute = (attributes: NamedNodeMap, name: string) => {
        if (!Array.isArray(options.prefix)) {
            return attributes.getNamedItem(getPrefix(name));
        }

        for (const str of options.prefix) {
            let key = attributes.getNamedItem(getPrefix(name, str));
            if (key !== null) {
                return key;
            }
        }
        return null;
    };

    const handleClick = (e: Event) => {
        const targetElement: HTMLElement = e.target as HTMLElement;

        const attributes = targetElement.attributes;
        // Check if we have a modal target
        let modalTarget = getAttribute(attributes, "target");
        if (modalTarget !== null) {
            console.log("showing modal");
            showModal(modalTarget.value);
        } else {
            console.warn("No valid target has been found for", targetElement);
        }
    };

    const closeModal = (modal: HTMLElement) => {
        modal.style.display = "none";
        document.iuActiveModal = null;
        document.removeEventListener("click", handleCloseModalClick);
    };

    const handleCloseModalClick = (e: Event) => {
        if (
            e.target === document["iuActiveModal"] &&
            document.iuActiveModal !== null
        ) {
            closeModal(document.iuActiveModal);
        }
    };

    const showModal = (queryString: string) => {
        const modal: HTMLElement | null = document.querySelector(queryString);
        if (modal === null) {
            console.error("Modal does not exist in the dom tree");
            return;
        }

        modal.style.display = "block";

        document["iuActiveModal"] = modal;
        document.addEventListener("click", handleCloseModalClick);

        // Handle close element if they exists
        let close = modal.querySelectorAll("close");
        if (close.length > 0) {
            close.forEach((el) => {
                el.addEventListener("click", () => closeModal(modal), {
                    once: true,
                });
            });
        }
    };

    const selectElements = (selectors: string[]) => {
        return selectors.reduce((acc: Element[], selector: string) => {
            const elements = document.querySelectorAll(selector);
            return acc.concat(Array.from(elements));
        }, []);
    };

    const selectors = Array.isArray(options.opentargets)
        ? options.opentargets
        : [options.opentargets];

    // Initialize click on all required parts
    selectElements(selectors).forEach((el) => {
        el.addEventListener("click", handleClick);
    });
};

if (import.meta.env.DEV) {
    setupSimpleModal({
        opentargets: "mm-modal",
        prefix: "",
    });
} else {
    window.setupSimpleModal = setupSimpleModal;
}
