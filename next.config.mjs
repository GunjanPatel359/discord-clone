/** @type {import('next').NextConfig} */
const nextConfig = {

    //in below code domains is deperacated
    // images:{
    //     domains:[
    //         "utfs.io",
    //         "uploadthing.com"
    //     ]
    // }
    // webpack:(config)=>{
    //     config.externals.push({
    //         "utf-8-validate":"commonjs utf-8-validate",
    //         bufferutil:"commonjs bufferutil"
    //     })
    //     return config
    // },
    images:{
        remotePatterns:[
            {hostname:"utfs.io"},
            {hostname:"uploadthing.com"},
        ]
    }
};

export default nextConfig;
