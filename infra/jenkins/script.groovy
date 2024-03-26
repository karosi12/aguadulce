def deployApp(){
    sh "ls -la"
    def ec2Instance = "ubuntu@${env.IP_ADDRESS}"

    sshagent(['ec2-server-key']) {
        sh "scp -o StrictHostKeyChecking=no docker-compose.yaml ${ec2Instance}:/home/ubuntu"
        sh "ssh -o StrictHostKeyChecking=no ${ec2Instance}"
    }     
    echo "success - Deployed"
}

def runTest() {
    dir("src") {
        //  install all dependencies needed for running tests
        sh "npm install"
        sh "npm run test"
    } 
}

return this
