export default {
    function: {
        version: '0.1.0',
        location: 'local',
        vpc_connector_name: 'vpc-connector',
        base_url: 'https://localhost:5001/'
    },
    system: {
        timeZone: 'Asia/Taipei'
    },
    app: {
        support_version: ['0.1.0']
    },
    redis: {
        token_cache: 0,
        verify_code_cache: 1
    }
}