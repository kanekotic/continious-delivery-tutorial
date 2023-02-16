package test

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/gruntwork-io/terratest/modules/files"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

func Clean() {
	defer os.Remove("./test-provider.tf")
	defer os.Remove("./terraform.tfstate")
	defer os.Remove("./terraform.tfstate.backup")
	defer os.Remove("./.terraform.lock.hcl")
	defer os.RemoveAll("./.terraform")
}
func Setup() {
	files.CopyFile("../../test/artifacts/provider.tf", "./test-provider.tf")
}
func TestLambdaModule(t *testing.T) {
	t.Parallel()
	defer Clean()
	Setup()
	terraformOptions := terraform.WithDefaultRetryableErrors(t, &terraform.Options{
		TerraformDir: "./",
		Vars:         map[string]interface{}{"source_dir": "../../../"},
	})

	defer terraform.Destroy(t, terraformOptions)
	terraform.InitAndApply(t, terraformOptions)

	stageName := terraform.Output(t, terraformOptions, "stage_name")
	restApiId := terraform.Output(t, terraformOptions, "rest_api_id")

	assert.Equal(t, "prod", stageName)
	assert.NotEmpty(t, restApiId)
}
