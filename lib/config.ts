export type ClusterConfig = {
  fqdn: string;

  eksInstanceTypes: string[];
  eksMinNodeCount: number;
  eksDesiredNodeCount: number;
  eksMaxNodeCount: number;
};

export function defaultConfig() {
  const config: ClusterConfig = {
    fqdn: "",
    eksInstanceTypes: ["t3.medium"],
    eksMinNodeCount: 1,
    eksDesiredNodeCount: 3,
    eksMaxNodeCount: 5,
  };
  return config;
}
