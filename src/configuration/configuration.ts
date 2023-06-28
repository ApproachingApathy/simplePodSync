import TOML from "@iarna/toml"
import { platform } from "os"
import { join, resolve } from "path"
import { deepmergeCustom } from "deepmerge-ts"

interface DatabaseDefinition {
    connector: string,
    url: string
}

type FilePath = string

interface Config {
    database: DatabaseDefinition,
    log_dir: FilePath,
    config_dir: FilePath,
    data_dir: FilePath
}

const getOSConfigDefaults = () => {
    const defaultConfig: Partial<Config> = {}
    let dataHome: string | undefined
    let configHome: string | undefined
    switch (platform()) {
        case "linux":
            dataHome = resolve(join(Bun.env.XDG_DATA_HOME ?? `${Bun.env.HOME}/.local/share`, "simple-pod-sync")) 
            configHome = resolve(join(Bun.env.XDG_CONFIG_HOME ?? `${Bun.env.HOME}/.config`, "simple-pod-sync"))
    }
    try {
    } catch {
        
    }
    if (!dataHome || !configHome) throw new Error("Configuration Error: Missing Dir")
    defaultConfig.log_dir = resolve(join(dataHome, "logs"))
    defaultConfig.config_dir = resolve(configHome)
    return {
        log_dir: resolve(join(dataHome, "logs")),
        config_dir: resolve(configHome),
        data_dir: resolve(dataHome)
    }
}

const getEnvConfig = (): Partial<Config> => {
    let configDir = Bun.env.SIMPLE_POD_CONFIG_DIR
    let logDir = Bun.env.SIMPLE_POD_LOG_DIR
    let dataDir = Bun.env.SIMPLE_POD_DATA_DIR

    return {
        log_dir: logDir,
        config_dir: configDir,
        data_dir: dataDir
    }
}

const getConfigFromFile = async (configDir: FilePath) => {
    const configFilePath = resolve(join(configDir, "simple-pod-sync.toml"))
    const file = Bun.file(configFilePath)
    return TOML.parse(await file.text() ?? "")
    // return {}
}

const createConfigFile = async (configDir: FilePath, config: Config) => {
    const configFilePath = resolve(join(configDir, "simple-pod-sync.toml"))
    const toml = TOML.stringify(config as any) 
    await Bun.write(configFilePath, toml)
}

const getDefaults = (): Config => {
    return {
        database: {
            connector: "sqlite",
            url: "file:./database/simplePodSync.db"
        },
        config_dir: "./config",
        data_dir: "./data",
        log_dir: "./data/logs"
    }
}

export const getConfig = async () => {
    const deepmerge = deepmergeCustom({
        mergeOthers: (values, utils) => {
            return utils.defaultMergeFunctions.mergeOthers(
                values.filter(v => v !== undefined)
            )
        }
    })

    const defaults = getDefaults()
    const osDefaults = getOSConfigDefaults()
    const envSettings = getEnvConfig()

    const config = deepmerge(defaults, osDefaults, envSettings) as Config
    let fileConfig = {}
    try {
        fileConfig = await getConfigFromFile(config.config_dir)
    } catch (e) {
        await createConfigFile(config.config_dir, config) 
    }
    
    const finalConfig = deepmerge(defaults, osDefaults, fileConfig, envSettings) as  Config
    return finalConfig
}

export const config = await getConfig()