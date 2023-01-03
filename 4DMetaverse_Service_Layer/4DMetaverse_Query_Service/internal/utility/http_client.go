package utility

import (
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

type HttpRequest struct {
	Method string
	Url    string
	Body   string
	Header map[string]string
}

type HttpResponse struct {
	StatusCode int
	Body       []byte
}

//go:generate mockgen -destination=../../test/mocks/mock_http_client.go -package=mocks . HttpClient
type HttpClient interface {
	Request(request HttpRequest) (*HttpResponse, error)
}

type DefaultHttpClient struct {
	client *http.Client
}

func NewDefaultHttpClient() *DefaultHttpClient {
	return &DefaultHttpClient{
		client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (c *DefaultHttpClient) Request(request HttpRequest) (*HttpResponse, error) {
	req, err := http.NewRequest(request.Method, request.Url, strings.NewReader(request.Body))
	if err != nil {
		return nil, err
	}

	if request.Header != nil {
		for k, v := range request.Header {
			req.Header.Add(k, v)
		}
	}

	res, err := c.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)

	if err != nil {
		return nil, err
	}
	return &HttpResponse{
		StatusCode: res.StatusCode,
		Body:       body,
	}, nil
}
