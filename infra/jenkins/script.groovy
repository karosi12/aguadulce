def deployApp(){
    sh "ls -la"

    sshagent(['ec2-server-key']) {
        sh "ssh -o StrictHostKeyChecking=no ubuntu@3.122.244.24 cd aguadulce && git pull origin https://github.com/karosi12/aguadulce.git && docker-compose up -d"
    }     
    echo "success - Deployed"
}

def runTest() {
    dir("src") {
        sh "npm install"
        sh "npm run test"
    } 
}

return this
