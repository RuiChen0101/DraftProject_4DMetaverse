package utility

import "time"

type Timer interface {
	Now() time.Time
}

type DefaultTimer struct{}

func (dt *DefaultTimer) Now() time.Time {
	return time.Now()
}
