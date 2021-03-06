# My Art Blog

About time I started one, really.

## Development

[Recently](https://github.com/tamouse/art_blog/releases/tag/post-gulp)
using [Drink up, Doctor!](https://github.com/tamouse/drink_up_doctor),
I converted this blog site to a gulp-driven development cycle.

Read the [Drink up, Doctor! README](DUD_README.md) for more
information on that.

The writing/dev cycle is now as simple as starting gulp:

``` bash
$ gulp
```

Everything else can be done in the editor, and your changes will
appear in a browser window automagically.

## Deployment

The deployment target is my Gandi VPS, under
http://art.tamouse.org.

To build the deployment distribution, stop the running gulp server,
and run:

``` bash
$ gulp dist
```

This will build the complete distribution and put it in the `_dist`
directory, which can then be used to push to the 'deploy' branch on
the remote server.

In the `_dist` directory, which ignored in the project root
directory's `.gitignore`, make sure you've initialized the remote repo
(should only need to be done once):

``` bash
$ cd _dist
$ git init
$ git remote add origin <git@remote/path/site.git>
```

And every time you want to publish:

``` bash
$ cd _dist
$ git add --all
$ git commit -m '2015-12-05-17-13-43'
$ git push -u origin HEAD
```

Then the post-receive hook will take care of the rest.

* TODO: add the setup into the `.setup.sh` script.
* TODO: add the push into the `gulpfile`.

### Post Receive hook on deployment site

To make the deployment work, I have a post-receive hook defined on the
remote site repository:

``` bash
#!/bin/sh

echo "[log] $0"

export GIT_WORK_TREE="/home/tamara/Sites/tamouse.org/art"
export BRANCH="master"

while read oldrev newrev refname
do
    echo "[log] oldrev: $oldrev"
    echo "[log] newrev: $newrev"
    echo "[log] refname: $refname"

    echo "[log] deploying to $GIT_WORK_TREE with $BRANCH"
    git checkout -f $BRANCH
done
```

## Remote Configuration

I have my remote site set up with [nginx] for serving static files and
reverse-proxying to applications, whichever they might be. As Jekyll
is producing a static site, it's quite easy to set up.

### Nginx configuration

The root for nginx sites is `/var/www`. It is configured to
automatically sort out static sites including subdomains. A symbolic
link from `art.tamouse.org` will point to
`/home/tamara/Sites/tamouse.org/art`, the location the remote
repository's post-receive hook script checks out the branch to.

#### Snippet from the `/etc/nginx/sites-available/virtualhosts` configuration file:

```
    # the following matches anything in HTTP_HOST, mapping www.$domain to $domain.
    # www.example.com and example.com will map to /var/www/example.com
    # www.wiki.example.com and wiki.example.com will map to /var/www/wiki.example.com
    server_name  ~^(www\.)?(?<domain>.+)$;
    root   /var/www/$domain;
    index  index.html index.htm index.php;
```

I should get around to writing this into a [swaac] post...
