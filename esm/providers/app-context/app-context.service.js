import { of } from '@fm/import-rxjs';
import { AppContextService as SharedAppContextService } from '@fm/shared/providers/app-context';
export class AppContextService extends SharedAppContextService {
    pageFileSource = {};
    microMiddlewareList = [];
    readStaticFile(url) {
        const { resource, readStaticFile } = this.getContext();
        const source = JSON.parse(readStaticFile(url) || '{}');
        const fileCache = { type: 'file-static', source };
        this.pageFileSource[url] = fileCache;
        resource[url] = fileCache;
        return of(source);
    }
    registryMicroMidder(middleware) {
        this.microMiddlewareList.push(middleware);
    }
    getPageFileSource() {
        return JSON.stringify(this.pageFileSource);
    }
    getAllFileSource() {
        return JSON.stringify(this.getContext().resource);
    }
    getpageMicroMiddleware() {
        return this.microMiddlewareList;
    }
}
