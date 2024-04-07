import {
  reactive,
  watch
} from "./chunk-NLG3GD5T.js";
import "./chunk-CSAU5B4Q.js";

// _build/html/node_modules/vitepress-plugin-tabs/src/client/index.ts
import PluginTabs from "/Users/lalonso/Documents/julia/doc/_build/html/node_modules/vitepress-plugin-tabs/src/client/PluginTabs.vue";
import PluginTabsTab from "/Users/lalonso/Documents/julia/doc/_build/html/node_modules/vitepress-plugin-tabs/src/client/PluginTabsTab.vue";

// _build/html/node_modules/vitepress-plugin-tabs/src/client/useTabsSelectedState.ts
var injectionKey = "vitepress:tabSharedState";
var ls = typeof localStorage !== "undefined" ? localStorage : null;
var localStorageKey = "vitepress:tabsSharedState";
var setLocalStorageValue = (v) => {
  if (!ls)
    return;
  ls.setItem(localStorageKey, JSON.stringify(v));
};
var provideTabsSharedState = (app) => {
  const state = reactive({});
  watch(
    () => state.content,
    (newStateContent, oldStateContent) => {
      if (newStateContent && oldStateContent) {
        setLocalStorageValue(newStateContent);
      }
    },
    { deep: true }
  );
  app.provide(injectionKey, state);
};

// _build/html/node_modules/vitepress-plugin-tabs/src/client/index.ts
var enhanceAppWithTabs = (app) => {
  provideTabsSharedState(app);
  app.component("PluginTabs", PluginTabs);
  app.component("PluginTabsTab", PluginTabsTab);
};
export {
  enhanceAppWithTabs
};
//# sourceMappingURL=vitepress-plugin-tabs_client.js.map
