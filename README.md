# 🖼️ image-server
An custom server for hosting images. Made to be run on a raspberry pi but i don't see why it would work on everything else.

# Setup
To use the image server create a json file called ```kv.json``` in the src folder. This is where the key-value pairs for the image will be stored so the code from the url can be converted into a path, then create a ```config.json``` file in the src folder and copy 
```json
{
    "imageFolder": "",
    "port": 5000
}
```
into it and add the path to the folder you want the image to download to and be taken from into ```imageFolder```.

# Routes
Information on the servers routes.

---

## /image/view/{image_code}
Returns the actual image.
## /image/query/{image_code}
If the image exists it returns data about the image. If it doesn't exist it returns a 400 error.

---

## /images
To see all images just use /images.
## /images/filter
To all images matching the specified filter. Make sure the use the correct spelling and capitalization of the query strings when filtering.
|Filter  |Usage|Format   |Description | Extra Features|
|:-----:|:---------------------------------:|:--------------:|:---------------------------:|:---------------------------------:|
|Type   |/images/filter?type={type}         |png, jpg, etc                                 |Filter by the images file type     |N/A|
|Date   |/images/filter?date={DD/MM/YYYY}   |DD/MM/YYYY (it **must** follow this format)   |Filter by the images upload date   |Wildcards: you can use wildcards to search for broader dates e.g. **/02/2023 is any day in feb 2023|
|Name   |/images/filter?name={name}         |the basic name (ignores the date)             |Filter by the images name          |N/A|
<details>
<summary>Examples</summary>
<p>• /images/filter?date=07/**/**** will return all images uploaded on the seventh day of any month of any year.</p>         
<p>• /images/filter?name=on will return all images that have the string on anywhere in their name (e.g. on, icon, icons, online, etc).</p>
</details>

---

## /upload
Uploads images to the server.   
The image must be submitted as a multipart-form and the key must be ```image```. The content type must also be set to ```image/{image_type}``` (e.g. ```image/png```). When you upload an image the server will try to assign it a code that is the file name minus the extension but if this is already taken it will assign it a randomly generated code.