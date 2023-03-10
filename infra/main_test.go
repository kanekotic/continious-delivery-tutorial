package test

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/gruntwork-io/terratest/modules/files"
	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

func Clean() {
	defer os.Remove("./terraform.tfstate")
	defer os.Remove("./terraform.tfstate.backup")
	defer os.RemoveAll("./.terraform")
	files.CopyFile("./provider.tf.backup", "./provider.tf")
	defer os.Remove("./provider.tf.backup")
}
func Setup() {
	files.CopyFile("./provider.tf", "./provider.tf.backup")
	files.CopyFile("./test/artifacts/provider.tf", "./provider.tf")
}
func TestLambdaIAccesible(t *testing.T) {
	Setup()
	defer Clean()
	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{TerraformDir: "./"})
	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)
	restApiId := terraform.Output(t, terraformOptions, "rest_api_id")
	stageName := terraform.Output(t, terraformOptions, "stage_name")
	url := fmt.Sprintf("http://localhost:4566/restapis/%s/%s/_user_request_/health", restApiId, stageName)
	http_helper.HttpGetWithRetry(t, url, nil, 200, "", 10, 5*time.Second)
}
