// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/main_db/internal/repository (interfaces: PurchaseRecordRepo)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/main_db/internal/entity"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
)

// MockPurchaseRecordRepo is a mock of PurchaseRecordRepo interface.
type MockPurchaseRecordRepo struct {
	ctrl     *gomock.Controller
	recorder *MockPurchaseRecordRepoMockRecorder
}

// MockPurchaseRecordRepoMockRecorder is the mock recorder for MockPurchaseRecordRepo.
type MockPurchaseRecordRepoMockRecorder struct {
	mock *MockPurchaseRecordRepo
}

// NewMockPurchaseRecordRepo creates a new mock instance.
func NewMockPurchaseRecordRepo(ctrl *gomock.Controller) *MockPurchaseRecordRepo {
	mock := &MockPurchaseRecordRepo{ctrl: ctrl}
	mock.recorder = &MockPurchaseRecordRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockPurchaseRecordRepo) EXPECT() *MockPurchaseRecordRepoMockRecorder {
	return m.recorder
}

// Create mocks base method.
func (m *MockPurchaseRecordRepo) Create(arg0 *entity.PurchaseRecord) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Create indicates an expected call of Create.
func (mr *MockPurchaseRecordRepoMockRecorder) Create(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockPurchaseRecordRepo)(nil).Create), arg0)
}

// FindByNativeSQL mocks base method.
func (m *MockPurchaseRecordRepo) FindByNativeSQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindByNativeSQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// FindByNativeSQL indicates an expected call of FindByNativeSQL.
func (mr *MockPurchaseRecordRepoMockRecorder) FindByNativeSQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindByNativeSQL", reflect.TypeOf((*MockPurchaseRecordRepo)(nil).FindByNativeSQL), arg0)
}