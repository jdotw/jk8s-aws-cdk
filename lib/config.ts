export type ClusterConfig = {
  hostedFQDN: string;
  rootFQDN: string;

  eksInstanceTypes: string[];
  eksMinNodeCount: number;
  eksDesiredNodeCount: number;
  eksMaxNodeCount: number;
};

export function defaultConfig(customConfig?: ClusterConfig) {
  const config: ClusterConfig = {
    hostedFQDN: "",
    rootFQDN: "",
    eksInstanceTypes: ["t3.medium"],
    eksMinNodeCount: 1,
    eksDesiredNodeCount: 3,
    eksMaxNodeCount: 5,
    ...customConfig,
  };
  return config;
}
