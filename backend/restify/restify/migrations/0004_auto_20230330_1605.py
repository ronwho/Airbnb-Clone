# Generated by Django 3.2.18 on 2023-03-30 20:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restify', '0003_auto_20230317_2115'),
    ]

    operations = [
        migrations.AddField(
            model_name='properties',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='properties',
            name='name',
            field=models.CharField(default='unnamed property', max_length=100),
        ),
    ]