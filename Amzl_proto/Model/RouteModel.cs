using Google.Cloud.Firestore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Amzl_proto.Model
{
    [FirestoreData]
    public class RouteModel
    {
        [FirestoreProperty]
        public int Wave { get; set; }

        [FirestoreProperty]
        public string Dsp { get; set; }

        [FirestoreProperty]
        public string Status { get; set; } //cehcked in, waiting, dropped 
        
        [FirestoreProperty]
        public string Zone { get; set; }

        [FirestoreProperty]
        public string Name { get; set; }

        [FirestoreProperty]
        public string Cx { get; set; }

        public string Id { get; set; }

    }
}
