import { cache } from "./services/auth";

{
    document.querySelectorAll('a.md-button').forEach((el) => {
        let href = el.href;
        let token = cache.getToken();
        if (href.startsWith("vscode://") && token !== "") {
            href += "&token=" + token;
            el.href = href;
        }
    });
}