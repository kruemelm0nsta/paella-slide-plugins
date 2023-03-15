import { PluginModule } from "paella-core";
import packageData from "../../package.json";
import dictionaries from '../dictionaries';

export default class SlidePluginsModule extends PluginModule {
    get moduleName() {
        return packageData.name;
    }

    get moduleVersion() {
        return packageData.version;
    }

    async getDictionaries() {
        return dictionaries;
    }
}