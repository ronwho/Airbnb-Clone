# Generated by Django 3.2.18 on 2023-03-17 21:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('restify', '0002_remove_properties_rate_per_day_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='properties',
            name='amenities',
            field=models.CharField(default=('wifi',), max_length=200),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='PropertyImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='property_images/')),
                ('properties', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='restify.properties')),
            ],
        ),
    ]
