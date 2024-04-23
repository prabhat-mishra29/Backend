import multer from multer;

//Here we save not upload.
//We have to use either diskstorage or memory.
//We use here disk storage.
const storage = multer.diskStorage(
    {
        //req :- coming from user.It does not have a file.
        //file:- multer has a file.
        destination: function (req, file, cb) {
            cb(null, './public/temp') // cb :- callback
        },

        filename: function (req, file, cb) {
            //you can add this.
                // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                // cb(null, file.fieldname + '-' + uniqueSuffix)
            cb(null, file.originalname)
        }
    }
)
  
export const upload = multer({ storage: storage })

/*
//How to upload example:-
    const upload = multer({ dest: 'uploads/' })

    const app = express()

    app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    })

    app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    })
*/