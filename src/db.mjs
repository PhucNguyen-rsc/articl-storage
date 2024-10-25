import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';

mongoose.connect(process.env.DSN);

const UserSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
});

const ArticleSchema = new mongoose.Schema({
  // TODO: finish this ArticleSchema so that it:
  // * contains a title, url, and descripition
  // * contains a user property that references a User document


  // end TODO
}, {timestamps: true});

UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=username%>'});
ArticleSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=title%>'});

mongoose.model('User', UserSchema);
mongoose.model('Article', ArticleSchema);



