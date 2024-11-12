## Table users
```SQL
                                       Table "public.users"
    Column     |          Type          | Collation | Nullable |              Default              
---------------+------------------------+-----------+----------+-----------------------------------
 id            | integer                |           | not null | nextval('users_id_seq'::regclass)
 username      | character varying(255) |           | not null | 
 email         | character varying(255) |           |          | 
 user_pass     | character varying(255) |           |          | 
 google_id     | character varying(255) |           |          | 
 auth_provider | character varying(50)  |           | not null | 'email'::character varying
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
    "users_google_id_key" UNIQUE CONSTRAINT, btree (google_id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "archivos_compartidos" CONSTRAINT "archivos_compartidos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    TABLE "archivos_subidos" CONSTRAINT "archivos_subidos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
```


## SSH Keys
```TEXT
 id |  alias  |                            key_value                             
----+---------\------------------------------------------------------------------
  1 | Canbril | -----BEGIN RSA PUBLIC KEY-----                                  +
    |         | MIIBCgKCAQEAxMDFho6+fFz6s+BfCc4zfJY+iCK7YQw9LNfKQQ4m/9IG+Kzir60R+
    |         | ovwYT6RpTBdcdadpZTtQ1rx5mZFwmki7huuntwSnE6D5X2LkVN0LhSuZmTADJpg9+
    |         | dlwvMtgHpimWpXX9c6uYbevp7oYTLzzfmHQ3mrfsl7phUzs229xoF6kq4G6Emsux+
    |         | RigtxS8RbRCM+7YMxINHjNPPadtqFe8fRCvKO9MJqFB8wT0uSCwGnH2u/vWwAkn1+
    |         | mVHM5Q8JYwMURXMWUjzyqIqF3UZes7+1SVShFLyFQfKeBup9JaJSPWVFe1Nkh41w+
    |         | LgeEwHbEuupClAApkMmmMYJkFwCu3TNxVQIDAQAB                        +
    |         | -----END RSA PUBLIC KEY-----                                    +
    |         | 
  2 | Carlos  | -----BEGIN RSA PUBLIC KEY-----                                  +
    |         | MIIBCgKCAQEAt5Eq3T1BOGRutLJJr+eXq4adHxy9Q9nVW4OxMhWHBX5NMCsH/RGE+
    |         | nQlRo/hmLi8bIZG5MUwyWJg3txwJiA2vnhGkgAXZFvUvBLShBE+7i2tUwz59FYIJ+
    |         | hwLWfxnvvGLxI0NpSqjcHfzUh8cGwcZdo3atgnqE4IC/o3xf+6x+2L8Le8QVkXnn+
    |         | uGjGHj1dI90RZbdXK4csuAcP1miZk+ZGmAwEgyf5HNTnGlLHleryaHLGeQaeUiwa+
    |         | QMl9cPBzmi3xafc6vEWIMiDewpPDlljPHr00PpZ8LN8CCRJx3rp1Df4H6I6pXCrP+
    |         | M55dWjwH8WYW/E+6V73thk9jevmJDg4NLQIDAQAB                        +
    |         | -----END RSA PUBLIC KEY-----                                    +
    |         |
```