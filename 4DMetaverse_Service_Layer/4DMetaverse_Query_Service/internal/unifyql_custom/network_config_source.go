package unifyql_custom

import (
	"4dmetaverse/query_service/internal/utility"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/RuiChen0101/UnifyQL_go/pkg/service_config"
)

type NetworkConfigSource struct {
	serviceConfigs map[string]service_config.ServiceConfig
	tableMapping   map[string]string
}

func NewNetworkConfigSource(hc utility.HttpClient) *NetworkConfigSource {
	configs := []service_config.ServiceConfig{{
		ServiceName: "mainDb",
		Url:         os.Getenv("MAIN_DB_URL"),
		Tables:      []string{},
	}, {
		ServiceName: "userDb",
		Url:         os.Getenv("USER_DB_URL"),
		Tables:      []string{},
	}, {
		ServiceName: "storageService",
		Url:         os.Getenv("STORAGE_SERVICE_URL"),
		Tables:      []string{},
	}}

	source := NetworkConfigSource{
		serviceConfigs: map[string]service_config.ServiceConfig{},
		tableMapping:   map[string]string{},
	}
	for _, c := range configs {
		serviceName := c.ServiceName
		source.serviceConfigs[serviceName] = c
		source.RemoteTriggerUpdate(serviceName, hc)
	}
	return &source
}

func (cs *NetworkConfigSource) GetServiceConfigs() map[string]service_config.ServiceConfig {
	return cs.serviceConfigs
}

func (cs *NetworkConfigSource) GetTableMapping() map[string]string {
	return cs.tableMapping
}

func (cs *NetworkConfigSource) RemoteTriggerUpdate(serviceName string, hc utility.HttpClient) error {
	serviceConfig, ok := cs.serviceConfigs[serviceName]
	if !ok {
		return fmt.Errorf("NetworkConfigSource: update fail - %s not defined", serviceName)
	}
	url := serviceConfig.Url + "/system/serviceConfig"
	resp, err := hc.Request(utility.HttpRequest{
		Method: "GET",
		Url:    url,
	})
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("NetworkConfigSource: %s response %d when executing", url, resp.StatusCode)
	}

	config := service_config.ServiceConfig{}
	json.Unmarshal(resp.Body, &config)

	originConfig := cs.serviceConfigs[serviceName]
	originConfig.Tables = config.Tables
	cs.serviceConfigs[serviceName] = originConfig
	for _, t := range config.Tables {
		cs.tableMapping[t] = serviceName
	}

	return nil
}
