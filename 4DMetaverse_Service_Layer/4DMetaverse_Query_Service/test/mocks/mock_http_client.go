// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/query_service/internal/utility (interfaces: HttpClient)

// Package mocks is a generated GoMock package.
package mocks

import (
	utility "4dmetaverse/query_service/internal/utility"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
)

// MockHttpClient is a mock of HttpClient interface.
type MockHttpClient struct {
	ctrl     *gomock.Controller
	recorder *MockHttpClientMockRecorder
}

// MockHttpClientMockRecorder is the mock recorder for MockHttpClient.
type MockHttpClientMockRecorder struct {
	mock *MockHttpClient
}

// NewMockHttpClient creates a new mock instance.
func NewMockHttpClient(ctrl *gomock.Controller) *MockHttpClient {
	mock := &MockHttpClient{ctrl: ctrl}
	mock.recorder = &MockHttpClientMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockHttpClient) EXPECT() *MockHttpClientMockRecorder {
	return m.recorder
}

// Request mocks base method.
func (m *MockHttpClient) Request(arg0 utility.HttpRequest) (*utility.HttpResponse, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Request", arg0)
	ret0, _ := ret[0].(*utility.HttpResponse)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Request indicates an expected call of Request.
func (mr *MockHttpClientMockRecorder) Request(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Request", reflect.TypeOf((*MockHttpClient)(nil).Request), arg0)
}
