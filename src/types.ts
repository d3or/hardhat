// tslint:disable-next-line no-implicit-dependencies
import { DeepPartial, Omit } from "ts-essentials";
import { EthereumProvider } from "web3x/providers";

import * as types from "./internal/core/params/argumentTypes";

export interface GanacheOptions {
  gasLimit?: number;
  network_id?: number;
  mnemonic?: string;
  accounts?: Array<{ balance: string; secretKey: string }>;
}

interface CommonNetworkConfig {
  chainId?: number;
  from?: string;
  gas?: "auto" | number;
  gasPrice?: "auto" | number;
}

interface AutoNetworkAccount {
  privateKey: string;
  balance: string;
}

export interface AutoNetworkConfig extends CommonNetworkConfig {
  accounts?: AutoNetworkAccount[];
  blockGasLimit?: number;
  ganacheOptions?: GanacheOptions;
}

export interface HDAccountsConfig {
  mnemonic: string;
  initialIndex?: number;
  count?: number;
  path?: string;
}

export interface OtherAccountsConfig {
  type: string;
}

export type NetworkConfigAccounts =
  | "remote"
  | string[]
  | HDAccountsConfig
  | OtherAccountsConfig;

export interface HttpNetworkConfig extends CommonNetworkConfig {
  url: string;
  accounts?: NetworkConfigAccounts;
}

export type NetworkConfig = AutoNetworkConfig | HttpNetworkConfig;

export interface Networks {
  [networkName: string]: NetworkConfig;
}

export interface ProjectPaths {
  root: string;
  configFile: string;
  cache: string;
  artifacts: string;
  sources: string;
}

export interface SolcConfig {
  version: string;
  optimizer: SolcOptimizerConfig;
}

export interface SolcOptimizerConfig {
  enabled: boolean;
  runs: number;
}

export interface BuidlerConfig {
  networks?: Networks;
  paths?: Omit<Partial<ProjectPaths>, "configFile">;
  solc?: DeepPartial<SolcConfig>;
  mocha?: Mocha.MochaOptions;
}

export interface ResolvedBuidlerConfig extends BuidlerConfig {
  paths: ProjectPaths;
  networks: Networks;
  solc: SolcConfig;
}

export type EnvironmentExtender = (env: BuidlerRuntimeEnvironment) => void;

export interface TasksMap {
  [name: string]: TaskDefinition;
}

export interface ConfigurableTaskDefinition {
  setDescription(description: string): this;

  setAction<ArgsT>(action: ActionType<ArgsT>): this;

  addParam<T>(
    name: string,
    description?: string,
    defaultValue?: T,
    type?: types.ArgumentType<T>,
    isOptional?: boolean
  ): this;

  addOptionalParam<T>(
    name: string,
    description?: string,
    defaultValue?: T,
    type?: types.ArgumentType<T>
  ): this;

  addPositionalParam<T>(
    name: string,
    description?: string,
    defaultValue?: T,
    type?: types.ArgumentType<T>,
    isOptional?: boolean
  ): this;

  addOptionalPositionalParam<T>(
    name: string,
    description?: string,
    defaultValue?: T,
    type?: types.ArgumentType<T>
  ): this;

  addVariadicPositionalParam<T>(
    name: string,
    description?: string,
    defaultValue?: T[],
    type?: types.ArgumentType<T>,
    isOptional?: boolean
  ): this;

  addOptionalVariadicPositionalParam<T>(
    name: string,
    description?: string,
    defaultValue?: T[],
    type?: types.ArgumentType<T>
  ): this;

  addFlag(name: string, description?: string): this;
}

export interface ParamDefinition<T> {
  name: string;
  defaultValue?: T;
  type: types.ArgumentType<T>;
  description?: string;
  isOptional: boolean;
  isFlag: boolean;
  isVariadic: boolean;
}

export interface OptionalParamDefinition<T> extends ParamDefinition<T> {
  defaultValue: T;
  isOptional: true;
}

export interface ParamDefinitionsMap {
  [paramName: string]: ParamDefinition<any>;
}

export interface BuidlerArguments {
  network: string;
  showStackTraces: boolean;
  version: boolean;
  help: boolean;
  emoji: boolean;
  config?: string;
}

export type BuidlerParamDefinitions = {
  [param in keyof Required<BuidlerArguments>]: OptionalParamDefinition<
    BuidlerArguments[param]
  >
};

export interface TaskDefinition extends ConfigurableTaskDefinition {
  readonly name: string;
  readonly description?: string;
  readonly action: ActionType<TaskArguments>;
  readonly isInternal: boolean;

  // TODO: Rename this to something better. It doesn't include the positional
  // params, and that's not clear.
  readonly paramDefinitions: ParamDefinitionsMap;

  readonly positionalParamDefinitions: Array<ParamDefinition<any>>;
}

export interface TaskArguments {
  [argumentName: string]: any;
}
export type RunTaskFunction = (
  name: string,
  taskArguments?: TaskArguments
) => Promise<any>;

export type RunSuperFunction<ArgT extends TaskArguments> = (
  taskArguments?: ArgT
) => Promise<any>;

export type ActionType<ArgsT extends TaskArguments> = (
  taskArgs: ArgsT,
  env: BuidlerRuntimeEnvironment,
  runSuper: RunSuperFunction<ArgsT>
) => Promise<any>;

// TODO: This may not be the correct interface, see
// https://ethereum-magicians.org/t/eip-1193-ethereum-provider-javascript-api/640/31?u=alcuadrado
export type IEthereumProvider = EthereumProvider;

export interface BuidlerRuntimeEnvironment {
  readonly provider: IEthereumProvider;
  readonly config: ResolvedBuidlerConfig;
  readonly buidlerArguments: BuidlerArguments;
  readonly tasks: TasksMap;
  readonly run: RunTaskFunction;
}
