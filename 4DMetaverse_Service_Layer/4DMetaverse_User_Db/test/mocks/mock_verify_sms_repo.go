// Code generated by MockGen. DO NOT EDIT.
// Source: 4dmetaverse/user_db/internal/repository (interfaces: VerifySmsRepo)

// Package mocks is a generated GoMock package.
package mocks

import (
	entity "4dmetaverse/user_db/internal/entity"
	reflect "reflect"

	gomock "github.com/golang/mock/gomock"
)

// MockVerifySmsRepo is a mock of VerifySmsRepo interface.
type MockVerifySmsRepo struct {
	ctrl     *gomock.Controller
	recorder *MockVerifySmsRepoMockRecorder
}

// MockVerifySmsRepoMockRecorder is the mock recorder for MockVerifySmsRepo.
type MockVerifySmsRepoMockRecorder struct {
	mock *MockVerifySmsRepo
}

// NewMockVerifySmsRepo creates a new mock instance.
func NewMockVerifySmsRepo(ctrl *gomock.Controller) *MockVerifySmsRepo {
	mock := &MockVerifySmsRepo{ctrl: ctrl}
	mock.recorder = &MockVerifySmsRepoMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use.
func (m *MockVerifySmsRepo) EXPECT() *MockVerifySmsRepoMockRecorder {
	return m.recorder
}

// Create mocks base method.
func (m *MockVerifySmsRepo) Create(arg0 *entity.VerifySms) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Create", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Create indicates an expected call of Create.
func (mr *MockVerifySmsRepoMockRecorder) Create(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Create", reflect.TypeOf((*MockVerifySmsRepo)(nil).Create), arg0)
}

// FindByNativeSQL mocks base method.
func (m *MockVerifySmsRepo) FindByNativeSQL(arg0 string) interface{} {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindByNativeSQL", arg0)
	ret0, _ := ret[0].(interface{})
	return ret0
}

// FindByNativeSQL indicates an expected call of FindByNativeSQL.
func (mr *MockVerifySmsRepoMockRecorder) FindByNativeSQL(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindByNativeSQL", reflect.TypeOf((*MockVerifySmsRepo)(nil).FindByNativeSQL), arg0)
}

// UpdateCodeUsed mocks base method.
func (m *MockVerifySmsRepo) UpdateCodeUsed(arg0, arg1 string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "UpdateCodeUsed", arg0, arg1)
	ret0, _ := ret[0].(error)
	return ret0
}

// UpdateCodeUsed indicates an expected call of UpdateCodeUsed.
func (mr *MockVerifySmsRepoMockRecorder) UpdateCodeUsed(arg0, arg1 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "UpdateCodeUsed", reflect.TypeOf((*MockVerifySmsRepo)(nil).UpdateCodeUsed), arg0, arg1)
}
