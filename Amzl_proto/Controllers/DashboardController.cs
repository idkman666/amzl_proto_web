using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Amzl_proto.Model;
using FireSharp.Interfaces;
using FireSharp.Config;
using FireSharp.Response;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Google.Cloud.Firestore;

namespace Amzl_proto.Controllers
{
    public class DashboardController : Controller
    {
        string path = AppDomain.CurrentDomain.BaseDirectory + @"protoamzl.json";
        FirestoreDb db;
        public DashboardController()
        {
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", path);
            try
            {
                db = FirestoreDb.Create("protoamzl");

            }
            catch (Exception e)
            {
                string s = e.ToString();
            }
        }
        //firebase realtime data
        IFirebaseConfig config = new FirebaseConfig
        {
            AuthSecret = "r3gG3LKp8nAKWm0P19Na88By19ukn1TAMvsYimDp",
            BasePath = "https://amzlproto-4897d-default-rtdb.firebaseio.com/"
        };
        IFirebaseClient client;

        //Firebase REALTIME DATABASE

        //[HttpPost]
        //[AllowAnonymous]
        //[Route("/PostRouteData")]
        //public void ParseAndSaveRouteData([FromBody] RouteViewModel routeData)
        //{
        //    string routeDataFromFrontEnd = routeData.RouteDescription;
        //    char zone = 'N';
        //    client = new FireSharp.FirebaseClient(config);
        //    StringReader reader = new StringReader(routeDataFromFrontEnd);
        //    while ((routeDataFromFrontEnd = reader.ReadLine()) != null)
        //    {       
        //        string[] cxLine = routeDataFromFrontEnd.Split("\t");
        //        zone = cxLine[2] == null || cxLine[2] == "" ? zone : char.Parse(cxLine[2]);
        //        RouteModel routeModel = new RouteModel();

        //        routeModel.Dsp = cxLine[0];
        //        routeModel.Zone = zone;
        //        routeModel.Status = "waiting";
        //        routeModel.Cx = cxLine[3];
        //        routeModel.Name = cxLine[4];
        //        routeModel.Wave = Int32.Parse(routeData.Wave);

        //        //save to firebase
        //        if (client != null)
        //        {
        //            PushResponse response = client.Push("Routes/", routeModel);
        //            routeModel.Id = response.Result.name;
        //            SetResponse setResponse = client.Set("Routes/" + routeModel.Id, routeModel);
        //        }
        //        else
        //        {
        //            //error handeling
        //        }               
        //    };
        //}

        [HttpGet]
        [AllowAnonymous]
        [Route("/GetRouteData")]
        public IEnumerable<RouteModel> GetRoutes()
        {
            client = new FireSharp.FirebaseClient(config);
            FirebaseResponse response = client.Get("Routes");
            dynamic data = JsonConvert.DeserializeObject<dynamic>(response.Body);
            List<RouteModel> routeList = new List<RouteModel>();
            if (data == null)
            {
                return null;
            }
            foreach (var route in data)
            {
                routeList.Add(JsonConvert.DeserializeObject<RouteModel>(((JProperty)route).Value.ToString()));
            }
            return routeList;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("/DropRoute")]
        public IEnumerable<RouteModel> DropSelectedRoute([FromBody] RouteModel routeData)
        {
            client = new FireSharp.FirebaseClient(config);
            FirebaseResponse setResponse = client.Update("Routes/" + routeData.Id.ToString(), routeData);
            return null;
        }

        //firestore database conneciton  


        [HttpPost]
        [AllowAnonymous]
        [Route("/PostRoutesToDb")]
        public async Task PostRoutesToFirestore([FromBody] RouteViewModel routeData)
        {
            if (routeData != null)
            {


                CollectionReference collectionReference = db.Collection("RouteList");
                string routeDataFromFrontEnd = routeData.RouteDescription;
                string zone = "N/A";
                client = new FireSharp.FirebaseClient(config);
                StringReader reader = new StringReader(routeDataFromFrontEnd);
                while ((routeDataFromFrontEnd = reader.ReadLine()) != null)
                {
                    string[] cxLine = routeDataFromFrontEnd.Split("\t");
                    zone = cxLine[2] == null || cxLine[2] == "" ? zone : cxLine[2].ToString();
                    RouteModel routeModel = new RouteModel();

                    routeModel.Dsp = cxLine[0];
                    routeModel.Zone = zone;
                    routeModel.Status = "waiting".ToUpper();
                    routeModel.Cx = cxLine[3];
                    routeModel.Name = NameParser(cxLine[4]);
                    routeModel.Wave = Int32.Parse(routeData.Wave);
                    try
                    {
                        await collectionReference.AddAsync(routeModel);
                    }
                    catch (Exception e)
                    {
                        string s = e.ToString();
                    }
                };
            }
        }

        string NameParser(string name)
        {
            StringBuilder sb = new StringBuilder();

            for (int i = 0; i < name.Length; i++)
            {
                if (Char.IsWhiteSpace(name[i]))
                {
                    sb.Append(name[i]);
                    sb.Append(name[i + 1]);
                    return sb.ToString();
                }
                sb.Append(name[i]);
            }

            return "N/A";
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/GetRoutesFromDb")]
        public async Task<IEnumerable<RouteModel>> GetRoutesFromDb()
        {
            List<RouteModel> routeList = new List<RouteModel>();
            try
            {
                Query routeQuery = db.Collection("RouteList");
                QuerySnapshot routeQuerySnapshot = await routeQuery.GetSnapshotAsync();
                foreach (DocumentSnapshot documentSnapshot in routeQuerySnapshot.Documents)
                {
                    if (documentSnapshot.Exists)
                    {
                        Dictionary<string, object> dataObject = documentSnapshot.ToDictionary();
                        string json = JsonConvert.SerializeObject(dataObject);
                        RouteModel routeModel = JsonConvert.DeserializeObject<RouteModel>(json);
                        routeModel.Id = documentSnapshot.Id;
                        routeList.Add(routeModel);
                    }
                }

            }
            catch (Exception e)
            {
                throw;
            }

            return routeList;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("/DropRouteFromDb")]
        public async Task DropSelectedRouteFromDb([FromBody] RouteModel routeData)
        {
            try
            {
                DocumentReference documentReference = db.Collection("RouteList").Document(routeData.Id);
                await documentReference.SetAsync(routeData, SetOptions.Overwrite);
            }
            catch (Exception e)
            {
                throw;
            }

        }

        [HttpPost]
        [AllowAnonymous]
        [Route("/ChangeWaveInDb")]
        public async Task ChangeWaveInDb([FromBody] RouteModel routeData)
        {
            try
            {
                DocumentReference documentReference = db.Collection("RouteList").Document(routeData.Id);
                await documentReference.SetAsync(routeData, SetOptions.Overwrite);
            }
            catch (Exception e)
            {
                throw;
            }

        }
    }
}
