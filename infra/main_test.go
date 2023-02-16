package test

import (
	"fmt"
	"os"
	"testing"
	"time"

	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"

	"github.com/gruntwork-io/terratest/modules/files"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

func Clean() {
	defer os.Remove("./test-provider.tf")
	defer os.Remove("./terraform.tfstate")
	defer os.Remove("./terraform.tfstate.backup")
	defer os.RemoveAll("./.terraform")
}
func Setup() {
	files.CopyFile("./test/artifacts/provider.tf", "./test-provider.tf")
}
func TestLambdaModule(t *testing.T) {
	t.Parallel()
	defer Clean()
	Setup()
	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{TerraformDir: "./"})

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	stageName := terraform.Output(t, terraformOptions, "stage_name")
	restApiId := terraform.Output(t, terraformOptions, "rest_api_id")
	url := fmt.Sprintf("http://localhost:4566/restapis/%s/%s/_user_request_/say/hola", restApiId, stageName)

	http_helper.HttpGetWithRetry(t, url, nil, 200, "", 10, 5*time.Second)
}
