using System;
using System.Collections;
using System.Xml;
using System.IO;
using System.Text;
using System.Linq;
using System.Collections.Generic;

namespace TEI2JSON
{
    public static class ext
    {
        public static IList<XmlNode> ToList(this XmlNodeList list)
        {
            var nodes = new List<XmlNode>();
            foreach (var node in list)
            {
                nodes.Add(node as XmlNode);
            }
            return nodes;
        }
    }
    
    class Program
    {
        static void Main(string[] args)
        {
            XmlDocument doc = new XmlDocument();
            try
            {

                var path = Path.GetFullPath(args[0]);
                doc.Load(path);
                var all = doc.SelectNodes(@"//*[local-name() = 'entry']/*[local-name() = 'form']/*[local-name() = 'orth']");
                StringBuilder sb = new StringBuilder();
                sb.Append("[");
                var textArray = from entry in all.ToList()
                    select "\"" + entry.InnerText.ToLower() + "\"";
                
                sb.Append(String.Join(",", textArray));
                sb.Append("]");
                File.WriteAllText("words.json", sb.ToString());

            }
            catch (Exception e)
            {
                Console.WriteLine("Please provide a TEI File https://github.com/freedict/fd-dictionaries");
            }
        }

    }
}