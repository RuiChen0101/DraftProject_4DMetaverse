package unifyql_custom

import (
	"4dmetaverse/query_service/internal/utility"
	"time"

	"github.com/RuiChen0101/UnifyQL_go/pkg/execution_plan"
	"github.com/goccy/go-json"
)

type RedisPlanCache struct {
	redis utility.RedisClient
}

func NewRedisPlanCache(redis utility.RedisClient) *RedisPlanCache {
	return &RedisPlanCache{
		redis: redis,
	}
}

func (rpc *RedisPlanCache) Set(key string, plan *execution_plan.ExecutionPlan) {
	planStr, _ := json.Marshal(plan)
	rpc.redis.Set(key, string(planStr))
	rpc.redis.Expire(key, 3*time.Hour)
}

func (rpc *RedisPlanCache) Get(key string) (*execution_plan.ExecutionPlan, bool) {
	cache, err := rpc.redis.Get(key)
	if err != nil {
		return nil, false
	}
	rpc.redis.Expire(key, 3*time.Hour)
	plan := &execution_plan.ExecutionPlan{}
	json.Unmarshal([]byte(cache), plan)
	return plan, true
}

func (rpc *RedisPlanCache) FreeSpace() {}
