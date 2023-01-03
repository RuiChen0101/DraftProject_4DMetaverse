package unifyql_custom_test

import (
	"4dmetaverse/query_service/internal/unifyql_custom"
	"4dmetaverse/query_service/test/mocks"
	"fmt"
	"testing"
	"time"

	"github.com/RuiChen0101/UnifyQL_go/pkg/execution_plan"
	"github.com/golang/mock/gomock"
	"github.com/stretchr/testify/suite"
)

type RedisPlanCacheTestSuite struct {
	suite.Suite
	redisClient *mocks.MockRedisClient
}

func (rps *RedisPlanCacheTestSuite) SetupSuite() {
	ctrl := gomock.NewController(rps.T())
	defer ctrl.Finish()
	rps.redisClient = mocks.NewMockRedisClient(ctrl)
}

func (rps *RedisPlanCacheTestSuite) TestSet() {
	rps.redisClient.EXPECT().Set(gomock.Eq("key"), gomock.Eq("{\"operation\":0,\"query\":\"user\"}"))
	rps.redisClient.EXPECT().Expire(gomock.Eq("key"), gomock.Eq(3*time.Hour))

	cache := unifyql_custom.NewRedisPlanCache(rps.redisClient)

	cache.Set("key", &execution_plan.ExecutionPlan{
		Operation: 0,
		Query:     "user",
	})
}

func (rps *RedisPlanCacheTestSuite) TestGet() {
	rps.redisClient.EXPECT().Get(gomock.Eq("key")).Return("{\"operation\":0,\"query\":\"user\"}", nil)
	rps.redisClient.EXPECT().Expire(gomock.Eq("key"), gomock.Eq(3*time.Hour))

	cache := unifyql_custom.NewRedisPlanCache(rps.redisClient)

	plan, ok := cache.Get("key")

	rps.True(ok)
	rps.Equal(0, plan.Operation)
	rps.Equal("user", plan.Query)
}

func (rps *RedisPlanCacheTestSuite) TestGetFail() {
	rps.redisClient.EXPECT().Get(gomock.Eq("key")).Return("", fmt.Errorf("error"))
	rps.redisClient.EXPECT().Expire(gomock.Eq("key"), gomock.Eq(3*time.Hour))

	cache := unifyql_custom.NewRedisPlanCache(rps.redisClient)

	plan, ok := cache.Get("key")

	rps.False(ok)
	rps.Nil(plan)
}

func TestRedisPlanCache(t *testing.T) {
	suite.Run(t, new(RedisPlanCacheTestSuite))
}
