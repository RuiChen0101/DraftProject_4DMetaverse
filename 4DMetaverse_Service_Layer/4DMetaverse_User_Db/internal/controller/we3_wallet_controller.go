package controller

import (
	"4dmetaverse/user_db/internal/service"
	"4dmetaverse/user_db/internal/utility"
	"net/http"

	"github.com/gin-gonic/gin"
)

type web3WalletApiHandler struct {
	web3WalletService service.Web3WalletService
}

func RegisterWeb3Wallet(
	engine *gin.Engine,
	sm *service.ServiceManager,
) {
	h := web3WalletApiHandler{
		web3WalletService: service.GetService[service.Web3WalletService](sm, "web3_wallet"),
	}

	walletGroup := engine.Group("/web3Wallet")
	walletGroup.POST("/create", h.create)
	walletGroup.GET("/get/address/:address", h.getByAddress)
}

func (h *web3WalletApiHandler) create(c *gin.Context) {
	walletDto := service.Web3WalletCreateDTO{}
	if err := c.ShouldBindJSON(&walletDto); err != nil {
		c.Data(http.StatusBadRequest, "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	wallet, err := h.web3WalletService.CreateEntity(walletDto)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, wallet)
}

func (h *web3WalletApiHandler) getByAddress(c *gin.Context) {
	address := c.Param("address")

	wallet, err := h.web3WalletService.GetEntityByAddress(address)

	if err != nil {
		c.Data(utility.ConvertDbErrorToStatus(err), "text/plain; charset=utf-8", []byte(err.Error()))
		return
	}

	c.JSON(http.StatusOK, wallet)
}
