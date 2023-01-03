package unifyql_custom

import (
	"4dmetaverse/query_service/internal/utility"
	"encoding/base64"
	"fmt"
	"net/http"
)

type CustomFetchProxy struct {
	hc utility.HttpClient
}

func NewCustomFetchProxy(hc utility.HttpClient) *CustomFetchProxy {
	return &CustomFetchProxy{
		hc: hc,
	}
}

func (fp *CustomFetchProxy) Request(id string, url string, uqlPayload string) ([]byte, error) {
	base64Payload := base64.StdEncoding.EncodeToString([]byte(uqlPayload))
	req := utility.HttpRequest{
		Method: "POST",
		Url:    url + "/query/raw",
		Header: map[string]string{
			"Content-Type": "text/plain",
		},
		Body: base64Payload,
	}
	if id == "root" {
		req.Url = url + "/query"
	}
	resp, err := fp.hc.Request(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusNotFound {
		return []byte("[]"), nil
	} else if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("FetchProxy: %s response %d when executing %s", url, resp.StatusCode, uqlPayload)
	}

	return resp.Body, nil
}
